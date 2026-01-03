import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Step } from '../utils/types';

/**
 * Props for the ResultsTable component.
 */
interface ResultsTableProps {
	/** Array of processing steps to display */
	steps: Step[];
	/** Callback function when user clicks to navigate to an iteration */
	onGoToIteration: (iteration: number) => void;
	/** Whether the modal is open */
	isOpen: boolean;
	/** Callback to open the modal */
	onOpen: () => void;
	/** Callback to close the modal */
	onClose: () => void;
}

/**
 * Component that displays all iteration results in a modal table.
 * Allows users to view all steps at once and navigate to specific iterations.
 *
 * @param props - Component props
 */
export const ResultsTable: React.FC<ResultsTableProps> = ({
	steps,
	onGoToIteration,
	isOpen,
	onClose,
}) => {
	const { t } = useLanguage();

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='6xl'
				scrollBehavior='inside'
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{t('results.tableTitle')}</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<TableContainer>
							<Table size='sm' variant='simple'>
								<Thead>
									<Tr>
										<Th>{t('results.iteration')}</Th>
										<Th>{t('results.inputBit')}</Th>
										<Th>{t('results.xorResult')}</Th>
										<Th>{t('results.outputBit')}</Th>
										<Th>{t('results.scrambled')}</Th>
										<Th>{t('results.descrambled')}</Th>
										<Th>{t('results.action')}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{steps.map(step => (
										<Tr key={step.iteration}>
											<Td fontWeight='bold'>{step.iteration}</Td>
											<Td fontFamily='monospace'>{step.inputBit}</Td>
											<Td fontFamily='monospace'>{step.xorResult}</Td>
											<Td fontFamily='monospace'>{step.outputBit}</Td>
											<Td fontFamily='monospace' fontSize='xs'>
												{step.accumulatedScrambled || '—'}
											</Td>
											<Td fontFamily='monospace' fontSize='xs'>
												{step.accumulatedDescrambled || '—'}
											</Td>
											<Td>
												<Button
													size='xs'
													colorScheme='teal'
													onClick={() => {
														onGoToIteration(step.iteration);
														onClose();
													}}
												>
													{t('results.goTo')}
												</Button>
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
